import { NextRequest, NextResponse } from 'next/server';
import { resFormat } from '../utils/resFormat';
import { generateToken } from '../utils/generateToken';
import { IUser, User } from '../models/User';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendResetEmail } from '../utils/sendEmail';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { connectDB } from '@/lib/mongoose';
import cloudinary from '@/lib/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { AppError } from './user.controller';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register User
export async function registerUser(req: NextRequest): Promise<NextResponse> {
    try {
        // 1) ensure Mongo is connected
        await connectDB()

        // 2) parse payload
        const { name, email, password, phone_number } = await req.json()

        // 3) check for existing user
        const existing = await User.findOne({ email })
        if (existing) {
            return NextResponse.json(
                resFormat(400, 'Email already exists', null, 0),
                { status: 400 }
            )
        }

        // 4) hash & create
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = generateVerificationCode()
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone_number,
            profile_picture: '',
            verificationToken,
            verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        await user.save()

        // 5) issue JWT
        const token = generateToken(user._id.toString())

        // 6) strip sensitive fields
        const {
            password: _,
            verificationToken: __,
            verificationTokenExpires: ___,
            resetPasswordToken: ____,
            resetPasswordExpires: _____,
            __v,
            ...safeUser
        } = user.toObject()

        // 7) build response + set cookie
        const response = NextResponse.json(
            resFormat(201, 'User registered successfully', safeUser, 1, token),
            { status: 201 }
        )
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60,
            path: '/',
        })
        return response
    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Failed to register user', null, 0),
            { status: 500 }
        )
    }
}
// Login User
export async function loginUser(req: NextRequest) {
    try {
        // 1) Make sure we're connected
        await connectDB()

        // 2) Parse credentials
        const { email, password } = await req.json()

        // 3) Lookup user
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                resFormat(400, 'Invalid email or password', null, 0),
                { status: 400 }
            )
        }

        // 4) Verify password
        const isMatch = await bcrypt.compare(password, user.password ?? '')
        if (!isMatch) {
            return NextResponse.json(
                resFormat(400, 'Invalid email or password', null, 0),
                { status: 400 }
            )
        }

        // 5) Update lastLogin
        user.lastLogin = new Date()
        await user.save()

        // 6) Issue token + prepare safe user object
        const token = generateToken(user._id.toString())
        const { password: _, __v, ...safeUser } = user.toObject()

        // 7) Build “NextResponse” with cookie + JSON body
        const response = NextResponse.json(
            resFormat(200, 'User logged in successfully', safeUser, 1, token),
            { status: 200 }
        )
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60,
            path: '/',
        })
        return response

    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Failed to login user', null, 0),
            { status: 500 }
        )
    }
}

// Forgot Password
export async function forgotPassword(req: NextRequest): Promise<NextResponse> {
    try {
        // 1) ensure DB is connected
        await connectDB()

        // 2) parse JSON payload
        const { email } = await req.json()

        // 3) find user
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                resFormat(404, 'User not found', null, 0),
                { status: 404 }
            )
        }

        // 4) generate & persist reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000) // 30 min
        await user.save()

        // 5) build reset link
        const baseUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000'
        const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${email}`

        // 6) send email
        const emailSent = await sendResetEmail(email, resetLink)
        if (!emailSent) {
            return NextResponse.json(
                resFormat(500, 'Failed to send reset email', null, 0),
                { status: 500 }
            )
        }

        // 7) success
        return NextResponse.json(
            resFormat(200, 'Reset email sent successfully', null, 1),
            { status: 200 }
        )
    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}

// Reset Password
export async function resetPassword(req: NextRequest): Promise<NextResponse> {
    try {
        // 1) ensure database connection
        await connectDB()

        // 2) parse and validate payload
        const { token, email, password } = await req.json()
        if (!token || !email || !password) {
            return NextResponse.json(
                resFormat(400, 'Missing fields', null, 0),
                { status: 400 }
            )
        }

        // 3) find the user having a valid, non-expired reset token
        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        })
        if (!user) {
            return NextResponse.json(
                resFormat(400, 'Invalid or expired token', null, 0),
                { status: 400 }
            )
        }

        // 4) hash new password and clear reset fields
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        // 5) respond with success
        return NextResponse.json(
            resFormat(200, 'Password updated successfully', null, 1),
            { status: 200 }
        )

    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}



interface CloudinarySearchResource {
    public_id: string
}
interface CloudinarySearchResponse {
    resources: CloudinarySearchResource[]
}

export async function updateProfile(
    req: NextRequest,
    userId: string
): Promise<NextResponse> {
    try {
        // ─── ensure DB is connected ───
        await connectDB()

        // ─── parse multipart/form-data ───
        const form = await req.formData()
        const nameRaw = form.get('name')
        const phoneRaw = form.get('phone_number')
        const dobRaw = form.get('date_of_birth')
        const genderRaw = form.get('gender')
        const fileField = form.get('profile_picture') as File | null

        const name = typeof nameRaw === 'string' ? nameRaw : undefined
        const phone_number = typeof phoneRaw === 'string' ? phoneRaw : undefined
        const date_of_birth = typeof dobRaw === 'string' ? dobRaw : undefined
        const gender = typeof genderRaw === 'string' ? genderRaw : undefined

        // ─── delete any existing profile images ───
        const folderPath = `buzzChat-uploads/profile/Id_${userId}`
        const existing = (await cloudinary.search
            .expression(`folder:${folderPath}`)
            .max_results(10)
            .execute()) as CloudinarySearchResponse

        if (existing.resources.length > 0) {
            await Promise.all(
                existing.resources.map(r => cloudinary.uploader.destroy(r.public_id))
            )
        }

        // ─── upload new image if provided ───
        let profile_picture: string | undefined
        if (fileField && fileField.size > 0) {
            const buffer = Buffer.from(await fileField.arrayBuffer())
            const uploadResult = (await new Promise<UploadApiResponse>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: folderPath,
                        public_id: `${Date.now()}`,
                        overwrite: true,
                        format: 'png',
                    },
                    (err, result) => (err ? reject(err) : resolve(result!))
                )
                stream.end(buffer)
            }))
            profile_picture = uploadResult.secure_url
        }

        // ─── build update payload ───
        const updateFields: Partial<IUser> = {}
        if (name) updateFields.name = name
        if (phone_number) updateFields.phone_number = phone_number
        if (gender) updateFields.gender = gender
        if (profile_picture) updateFields.profile_picture = profile_picture

        if (date_of_birth) {
            const parsed = new Date(date_of_birth)
            if (!isNaN(parsed.getTime())) {
                updateFields.date_of_birth = parsed
            }
        }

        // ─── persist changes ───
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        )
            .select('-password -resetPasswordToken -resetPasswordExpires -verificationToken -verificationTokenExpires')

        if (!updatedUser) {
            return NextResponse.json(
                resFormat(404, 'User not found', null, 0),
                { status: 404 }
            )
        }

        // ─── return success ───
        return NextResponse.json(
            resFormat(200, 'Profile updated', { user: updatedUser }, 1),
            { status: 200 }
        )
    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json(
            resFormat(500, 'Server error', null, 0),
            { status: 500 }
        )
    }
}



// Logout User
export async function logoutUser() {
    const response = NextResponse.json(resFormat(200, 'Logged out successfully', null, 1), { status: 200 });
    response.cookies.delete({ name: 'token', path: '/' });
    return response;
}

// Google Login
export async function googleLogin(req: NextRequest) {
    try {
        const { token } = await req.json();
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (!payload?.email) {
            return NextResponse.json(resFormat(400, 'Invalid token', null, 0), { status: 400 });
        }

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({ name: payload.name, email: payload.email, profile_picture: payload.picture, authType: 'google' });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        return NextResponse.json({ message: 'Google login success', jsonResponse: { user, token: accessToken } }, { status: 200 });
    } catch (err: unknown) {
        const error = err as AppError
        console.error(error.message)
        return NextResponse.json({ message: 'Google login failed' }, { status: 500 });
    }
}
