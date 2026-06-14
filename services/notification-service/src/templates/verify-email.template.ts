type VerifyEmailTemplateInput = {
  name?: string;
  verificationUrl: string;
};

export const verifyEmailTemplate = ({ name, verificationUrl }: VerifyEmailTemplateInput) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
</head>
<body style="
  margin:0;
  padding:0;
  background:#f5f7fa;
  font-family:Arial, Helvetica, sans-serif;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 0;"
  >
    <tr>
      <td align="center">

        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
          "
        >

          <tr>
            <td
              align="center"
              style="
                background:#0f172a;
                color:#ffffff;
                padding:32px;
              "
            >
              <h1 style="margin:0;">
                Bus Booking
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">

              <h2 style="margin-top:0;">
                Welcome${name ? `, ${name}` : ''} 👋
              </h2>

              <p style="
                font-size:16px;
                line-height:1.6;
                color:#475569;
              ">
                Thank you for registering.
                Please verify your email address to
                activate your account.
              </p>

              <div style="
                text-align:center;
                margin:32px 0;
              ">
                <a
                  href="${verificationUrl}"
                  style="
                    display:inline-block;
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:8px;
                    font-weight:bold;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p style="
                font-size:14px;
                color:#64748b;
              ">
                If the button doesn't work, copy and
                paste the following link into your browser:
              </p>

              <p style="
                word-break:break-all;
                color:#2563eb;
              ">
                ${verificationUrl}
              </p>

            </td>
          </tr>

          <tr>
            <td
              align="center"
              style="
                padding:24px;
                background:#f8fafc;
                color:#64748b;
                font-size:12px;
              "
            >
              © ${new Date().getFullYear()} Bus Booking.
              All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
