export function notificationEmailTemplate (EMAIL_TEMPLATE_GREETING, EMAIL_TEMPLATE_BODY, EMAIL_TEMPLATE_CLOSING) {
  const template = `
  <html>
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  </head>
  <body>
  <table style="background-color: #f3f4f4;" cellspacing="0" cellpadding="0" width="100%" align="center" bgcolor="#F3F4F4">
    <tbody>
      <tr>
        <td><br />
        <table style="background-color: #d9dadb;" cellspacing="0" cellpadding="1" align="center" bgcolor="#D9DADB">
          <tbody>
            <tr style="margin-top:25px;">
                <td>
                    <a href="https://qubicles.io?utm_source=welcome-email-logo-click"><img src="https://i.imgur.com/F9dXtIJ.jpg" alt="Qubicles" /></a>
                </td>
            </tr>
            <tr>
              <td>
              <table style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 20px; background-color: #ffffff; font-color: black;" cellspacing="0" cellpadding="0" width="600" align="center" bgcolor="#ffffff">
                <tbody>
                  <tr>
                    <td width="30"><img style="display: block;" src="https://i.imgur.com/kedUrBx.gif" alt="blank.gif" border="0" alt="" width="1" height="1" /></td>
                    <td style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 20px;">
                      <table border="0">
                          <tr>
                              <td>
                                <p>
                                    ${EMAIL_TEMPLATE_GREETING}, <br /><br />
                                    ${EMAIL_TEMPLATE_BODY}<br /><br />
                                    ${EMAIL_TEMPLATE_CLOSING}<br /><br />
                                    Sincerely,
                                </p>
                                <p>
                                  The Qubicles Team<br /><br />
                                </p>
                              </td>
                          </tr>
                      </table>
                    </td>
                    <td width="30"><img style="display: block;" src="https://i.imgur.com/kedUrBx.gif" alt="blank.gif" border="0" alt="" width="1" height="1" /></td>
                  </tr>
                  <tr>
                    <td width="30"><img style="display: block;" src="https://i.imgur.com/kedUrBx.gif" alt="blank.gif" border="0" alt="" width="1" height="1" /></td>
                    <td align="right"><hr size="1px" /></td>
                    <td width="30"><img style="display: block;" src="https://i.imgur.com/kedUrBx.gif" alt="blank.gif" border="0" alt="" width="1" height="1" /></td>
                  </tr>
                  <tr>
                    <td width="30"><img style="display: block;" src="https://i.imgur.com/kedUrBx.gif" alt="blank.gif" border="0" alt="" width="1" height="1" /></td>
                    <td align="left">
                        <p style="font-size: 9px; color: #999; line-height: 12px; margin-top: 0px; text-align: center; font-family: Arial, Helvetica, sans-serif;" align="center"><br />
                        Qubicles is a registered trademarks of Qubicles, Inc. This message was produced and distributed by Qubicles, Inc. 3343 Peachtree Road, Suite #180-1150, Atlanta, GA 30326
                        </p>
                        <br />
                    </td>
                    <td width="30">
                      <img style="display: block;" src="https://i.imgur.com/kedUrBx.gif" alt="blank.gif" border="0" alt="" width="1" height="1" />
                    </td>
                  </tr>
                </tbody>
              </table>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        </td>
      </tr>
    </tbody>
  </table>
  </body>
  </html>
  `
  return template
}
