import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendOrderConfirmation = async (
    toEmail: string,
    orderId: string,
    items: any[],
    total: number,
    isWhatsApp: boolean = false
) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            console.warn("SMTP credentials not configured. Skipping email.");
            return false;
        }

        const itemsList = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name || 'Product'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity || 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
            </tr>
        `).join('');

        const message = isWhatsApp 
            ? 'We have received your WhatsApp order request. Please complete the payment via WhatsApp to confirm the order.' 
            : 'Thank you for your purchase! Your order has been successfully confirmed and is being processed.';

        const html = `
            <div style="font-family: Arial, sans-serif; max-w-xl mx-auto p-4">
                <h1 style="color: #000; font-weight: 900;">Order ${isWhatsApp ? 'Requested' : 'Confirmed'}!</h1>
                <p>${message}</p>
                
                <h3 style="margin-top: 20px;">Order Details (#${orderId})</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f9f9f9;">
                            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #000;">Item</th>
                            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #000;">Qty</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #000;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsList}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Grand Total:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold;">₹${total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">Thank you for shopping with us!</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"My Store" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: `Order ${isWhatsApp ? 'Requested' : 'Confirmed'} - #${orderId}`,
            html: html,
        });

        console.log(`Confirmation email sent to ${toEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
};
