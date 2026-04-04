const getFriendRequestEmailTemplate = ({
    senderName = "A friend",
    senderEmail,
    recipientEmail,
    appName = "SplitBuddy",
    acceptUrl = "#",
  }) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friend Request from ${senderName}</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef7f0;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef7f0;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">
            
            <!-- Header with gradient -->
            <tr>
              <td style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); padding: 40px 30px; text-align: center;">
                <!-- Cute mascot/icon -->
                <div style="width: 80px; height: 80px; background-color: #fff5e6; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                  <span style="font-size: 40px;">🐻</span>
                </div>
                <h1 style="margin: 0; color: #1a1a2e; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                  You've Got a Friend Request! 🎉
                </h1>
              </td>
            </tr>
            
            <!-- Main content -->
            <tr>
              <td style="padding: 40px 30px;">
                <!-- Sender info card -->
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #e8f4f8 0%, #f0f9ff 100%); border-radius: 16px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 24px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td width="60" valign="top">
                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; text-align: center; line-height: 56px; color: white; font-size: 24px; font-weight: bold;">
                              ${senderName.charAt(0).toUpperCase()}
                            </div>
                          </td>
                          <td style="padding-left: 16px; vertical-align: middle;">
                            <p style="margin: 0 0 4px; font-size: 18px; font-weight: 700; color: #1a1a2e;">
                              ${senderName}
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                              ${senderEmail}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                  <strong>${senderName}</strong> wants to connect with you on <strong>${appName}</strong>! 
                  Accept their request to start splitting expenses together and keep track of who owes what. 💰
                </p>
                
                <!-- CTA Button -->
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding: 8px 0 24px;">
                      <a href="${acceptUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #1a1a2e; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 50px; box-shadow: 0 4px 16px rgba(255, 154, 158, 0.4); transition: transform 0.2s;">
                        ✨ Accept Friend Request
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Secondary link -->
                <p style="margin: 0; font-size: 14px; color: #9ca3af; text-align: center;">
                  Or copy this link: <br>
                  <a href="${acceptUrl}" style="color: #667eea; word-break: break-all;">${acceptUrl}</a>
                </p>
              </td>
            </tr>
            
            <!-- Features section -->
            <tr>
              <td style="padding: 0 30px 40px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef7f0; border-radius: 16px; padding: 24px;">
                  <tr>
                    <td style="padding: 24px;">
                      <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #1a1a2e; text-align: center;">
                        What you can do together:
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td width="33%" align="center" style="padding: 8px;">
                            <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                            <p style="margin: 0; font-size: 12px; color: #6b7280;">Split expenses</p>
                          </td>
                          <td width="33%" align="center" style="padding: 8px;">
                            <div style="font-size: 24px; margin-bottom: 8px;">👥</div>
                            <p style="margin: 0; font-size: 12px; color: #6b7280;">Create groups</p>
                          </td>
                          <td width="33%" align="center" style="padding: 8px;">
                            <div style="font-size: 24px; margin-bottom: 8px;">💸</div>
                            <p style="margin: 0; font-size: 12px; color: #6b7280;">Settle up easily</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #1a1a2e;">
                        🐻 ${appName}
                      </p>
                      <p style="margin: 0 0 16px; font-size: 12px; color: #9ca3af;">
                        Split expenses the fun way!
                      </p>
                      <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                        This email was sent to ${recipientEmail} because ${senderEmail} sent you a friend request.
                        <br>
                        If you didn't expect this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
          </table>
          
          <!-- Unsubscribe footer -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px;">
            <tr>
              <td align="center" style="padding: 24px 20px;">
                <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                  © ${new Date().getFullYear()} ${appName}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>
  </body>
  </html>
    `.trim();
  };
  // Plain text version for email clients that don't support HTML
   const getFriendRequestEmailPlainText = ({
    senderName = "A friend",
    senderEmail,
    recipientEmail,
    appName = "SplitBuddy",
    acceptUrl = "#",
  }) => {
    return `
  You've Got a Friend Request! 🎉
  ${senderName} (${senderEmail}) wants to connect with you on ${appName}!
  Accept their request to start splitting expenses together and keep track of who owes what.
  Click here to accept: ${acceptUrl}
  ---
  What you can do together:
  📊 Split expenses
  👥 Create groups
  💸 Settle up easily
  ---
  This email was sent to ${recipientEmail} because ${senderEmail} sent you a friend request.
  If you didn't expect this, you can safely ignore this email.
  © ${new Date().getFullYear()} ${appName}. All rights reserved.
    `.trim();
  };
  module.exports = {
    getFriendRequestEmailTemplate,
    getFriendRequestEmailPlainText,
  };