const { app, mongoose } = require('./server');  
const request = require('supertest');
require("dotenv").config();

beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        try {
            await mongoose.connection.db.dropCollection('users');
        } catch (error) {
            console.error('Drop collection failed:', error.message);
        }
        await mongoose.connection.close();
    }
});

describe('POST Endpoints', () => {
    beforeEach(async () => {
        // Löschen des Benutzers, falls vorhanden
        try {
            await request(app).delete('/users/test@example.com');
        } catch (error) {
            console.log('No user to delete:', error.message);
        }

        // Registrieren des Benutzers zu Testzwecken
        await request(app)
            .post('/register')
            .send({
                email: 'test@example.com',
                password: '12345678'
            });
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                email: 'newuser@example.com',
                password: '12345678'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.text).toContain('User registered successfully');
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: '12345678'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('User logged in successfully');
    });

    it('should send a forgot password email', async () => {
        const res = await request(app)
            .post('/forgot-password')
            .send({ email: 'test@example.com' });
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Password reset email sent');
    });

    it('should reset the password', async () => {
        const tokenResponse = await request(app)
            .post('/forgot-password')
            .send({ email: 'test@example.com' });
        const token = tokenResponse.body.token;

        const res = await request(app)
            .post(`/reset-password/${token}`)
            .send({ password: 'newpassword123' });
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Password has been reset successfully');
    });
});
