import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Env } from 'src/config/env';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}
  async create(data: CreateContactDto) {
    const { name, phone, email, message } = data;

    const contact = this.contactRepository.create({
      name,
      phone,
      message,
      email,
    });

    await this.contactRepository.save(contact);

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Env.EMAIL_USER,
        pass: Env.EMAIL_PASS,
      },
    });

    const mailHtml = `
<div style="max-width: 600px; margin: auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; color: #333;">
  <h2 style="text-align: center; color: #007BFF;">📩 New Contact Message</h2>
  
  <p style="font-size: 16px;"><strong>Name:</strong> ${name}</p>
  <p style="font-size: 16px;"><strong>Phone:</strong> ${phone}</p>
  <p style="font-size: 16px;"><strong>Email:</strong> 
    <a href="mailto:${email}" style="color: #007BFF; text-decoration: none;">${email}</a>
  </p>
  
  <div style="margin-top: 20px;">
    <p style="font-size: 16px; font-weight: bold;">Message:</p>
    <div style="padding: 15px; background-color: #f4f6f8; border-left: 4px solid #007BFF; border-radius: 5px;">
      <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #555;">${message}</p>
    </div>
  </div>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
  
  <p style="text-align: center; font-size: 13px; color: #999;">
    This message was submitted via the contact form on your website.<br>
    <em>Do not reply directly to this email.</em>
  </p>
</div>
`;

    const mailOptions = {
      from: Env.EMAIL_USER,
      to: Env.RECIPIENT_EMAIL,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
      html: mailHtml,
    };

    await transporter.sendMail(mailOptions);

    return {
      message: 'Email sent and contact saved successfully.',
      data: contact,
    };
  }
}
