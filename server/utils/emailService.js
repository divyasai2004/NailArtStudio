import nodemailer from "nodemailer";
import { DEFAULT_ADMIN_EMAIL } from "./ensureAdminUser.js";

/**
 * Sends order confirmation emails to the user and a notification to the admin.
 * @param {Object} order - The created order object from Mongoose.
 * @param {String} userEmail - The email address of the user who placed the order.
 */
export const sendOrderNotification = async (order, userEmail) => {
    let transporter;
    let senderEmail;

    if (
      !process.env.EMAIL_USER || 
      process.env.EMAIL_USER === "your_email@gmail.com" || 
      !process.env.EMAIL_PASS
    ) {
      console.log("No real email credentials found. Generating Ethereal test account...");
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      senderEmail = testAccount.user;
      console.log(`Ethereal test account created: ${testAccount.user}`);
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      senderEmail = process.env.EMAIL_USER;
    }

    const productsHtml = order.products
      .map(
        (p) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${p.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${p.price}</td>
          </tr>`
      )
      .join("");

    const orderHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        
        <h3>Products</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 8px; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Items Price:</td>
              <td style="text-align: right; padding: 8px;">₹${order.itemsPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Shipping:</td>
              <td style="text-align: right; padding: 8px;">₹${order.shippingPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold;">Discount:</td>
              <td style="text-align: right; padding: 8px; color: green;">-₹${order.discountAmount}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; padding: 8px; font-weight: bold; font-size: 1.1em;">Total:</td>
              <td style="text-align: right; padding: 8px; font-weight: bold; font-size: 1.1em;">₹${order.totalPrice}</td>
            </tr>
          </tfoot>
        </table>

        <h3>Shipping Address</h3>
        <p style="margin: 0;">${order.shippingAddress.addressLine1}</p>
        <p style="margin: 0;">${order.shippingAddress.city}, ${order.shippingAddress.postalCode || ""}</p>
        <p style="margin: 0;">Phone: ${order.shippingAddress.phone}</p>
      </div>
    `;

    // 1. Send to User
    const userInfo = await transporter.sendMail({
      from: `"Dreamy Nails" <${senderEmail}>`,
      to: userEmail,
      subject: `Order Confirmation - #${order._id}`,
      html: `<h1>Thank you for your order!</h1><p>We've received your order and are getting it ready.</p>${orderHtml}`,
    });
    console.log(`Order confirmation email sent to user: ${userEmail}`);
    if (userInfo.messageId && nodemailer.getTestMessageUrl(userInfo)) {
      console.log(`Preview User Email: ${nodemailer.getTestMessageUrl(userInfo)}`);
    }

    // 2. Send to Admin
    const adminEmail = DEFAULT_ADMIN_EMAIL;
    const adminInfo = await transporter.sendMail({
      from: `"Dreamy Nails System" <${senderEmail}>`,
      to: adminEmail,
      subject: `New Order Received - #${order._id}`,
      html: `<h1 style="color: #c0392b;">Action Required: New Order Received</h1><p>A new order has been placed on the website.</p>${orderHtml}`,
    });
    console.log(`Order notification email sent to admin: ${adminEmail}`);
    if (adminInfo.messageId && nodemailer.getTestMessageUrl(adminInfo)) {
      console.log(`Preview Admin Email: ${nodemailer.getTestMessageUrl(adminInfo)}`);
    }
    
  } catch (error) {
    console.error("Error sending order notification emails:", error);
  }
};
