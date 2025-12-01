import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
    private readonly uploadDir = process.env.UPLOAD_PATH || './uploads';
    private readonly maxFileSize =
        parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
    private readonly allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    constructor() {
        this.ensureUploadDir();
    }

    private ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async uploadFile(file: any): Promise<{
        filename: string;
        path: string;
        url: string;
    }> {
        // Validate file type
        if (!this.allowedMimes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only images are allowed.');
        }

        // Validate file size
        if (file.size > this.maxFileSize) {
            throw new Error(
                `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
            );
        }

        // Generate unique filename
        const ext = path.extname(file.originalname);
        const filename = `${uuid()}${ext}`;
        const filepath = path.join(this.uploadDir, filename);

        // Save file
        fs.writeFileSync(filepath, file.buffer);

        return {
            filename,
            path: filepath,
            url: `/uploads/${filename}`,
        };
    }

    async uploadMultiple(files: any[]): Promise<
        Array<{
            filename: string;
            path: string;
            url: string;
        }>
    > {
        const results = [];

        for (const file of files) {
            const result = await this.uploadFile(file);
            results.push(result);
        }

        return results;
    }

    async deleteFile(filename: string): Promise<boolean> {
        const filepath = path.join(this.uploadDir, filename);

        if (!fs.existsSync(filepath)) {
            return false;
        }

        fs.unlinkSync(filepath);
        return true;
    }

    getFileUrl(filename: string): string {
        return `/uploads/${filename}`;
    }

    isValidImageFile(mimetype: string): boolean {
        return this.allowedMimes.includes(mimetype);
    }

    isValidFileSize(size: number): boolean {
        return size <= this.maxFileSize;
    }
}
