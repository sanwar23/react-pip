export function newNotificationEmailTemplate ({
  EMAIL_TEMPLATE_IMAGE_SRC,
  EMAIL_TEMPLATE_TITLE,
  EMAIL_TEMPLATE_BODY,
  EMAIL_TEMPLATE_CLOSING
}) {
  const TEMPLATE_TITLE = EMAIL_TEMPLATE_TITLE ? `
  <tr style="background-color: #D5DFFC; text-align: center; margin-top: 10px;">
    <td width="60">
      <div style="text-align: center;  width: 80%; margin: 30px auto;">
      <h2 style="font-family:'Poppins', sans-serif;font-weight: bold;font-size:32px; color:#444F5F; margin-left: 20px">${EMAIL_TEMPLATE_TITLE}</h2>
      </div>
    </td>
  </tr>` : ''

  const TEMPLATE_IMAGE = EMAIL_TEMPLATE_IMAGE_SRC ? `
  <tr style="background-color: #D5DFFC; text-align: center; margin-top: 10px;">
    <td>
      <img src="${EMAIL_TEMPLATE_IMAGE_SRC}" alt="Qubicles"  width="200px" height="150px"/>
    </td>
  </tr>` : ''

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
        <table style="background-color: #FFFFFF;" cellspacing="0" cellpadding="1" align="center" bgcolor="#FFFFFF">
          <tbody>
            <tr style="margin-top:25px; background-color: #D5DFFC; text-align: center;">
              <td>
                <a href="https://qubicles.io?utm_source=welcome-email-logo-click"><img src="https://ipfs.telos.miami/ipfs/QmXYbQZKifuoUDjfZAQpyxJcTg75jrVZPtnZ27QQWEBMGg" alt="Qubicles" width="150px" height="50px"/></a>
              </td>
            </tr>
            ${TEMPLATE_IMAGE}
            ${TEMPLATE_TITLE}
            <tr>
              <td>
              <table style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 20px; background-color: #ffffff; font-color: black;" cellspacing="0" cellpadding="0" width="600" align="center" bgcolor="#ffffff">
                <tbody>
                  <tr>
                    <td style="font-family: arial, helvetica, sans-serif; font-size: 14px; line-height: 20px;">
                      <table border="0">
                          <tr>
                              <td style="padding: 0px 15px;">
                                <div style="font-family:'SF Pro Text';font-weight: normal;font-size:14px;color:#4A4A4A;text-align:left;margin-top:20px">
                                  ${EMAIL_TEMPLATE_BODY}<br /><br />
                                  ${EMAIL_TEMPLATE_CLOSING ? `${EMAIL_TEMPLATE_CLOSING}<br /><br />` : ''}
                                  <span style="font:inherit;"> Sincerely, </span>
                                </div>
                                <p style="font-family:'SF Pro Text';font-weight: normal;font-size:14px;color:#4A4A4A;text-align:left">
                                  The Qubicles Team<br /><br />
                                </p>
                              </td>
                          </tr>
                      </table>
                    </td>
                    <td width="30"><img style="display: block;" src="https://i.imgur.com/kedUrBx.gif" alt="blank.gif" border="0" alt="" width="1" height="1" /></td>
                  </tr>
                </tbody>
              </table>
              </td>
            </tr>
            <tr>
              <td width="90">
                <div style="background-color: #4877F4; padding: 0 20px 15px 20px; text-align-last: center;">
                  <p style="font-family:'SF Pro Text', Light;color: #fff; font-size: 13px; line-height: 12px; margin: 0;"><br />
                  Qubicles is a registered trademarks of Qubicles, Inc. This message was produced and distributed by Qubicles, Inc. 3343 Peachtree Road, Suite #180-1150, Atlanta, GA 30326
                  </p>
                  <p style="font-family:'SF Pro Text', Light; color: #ffffff; font-size: 13px; line-height: 12px; margin: 0;" align="center"><br />
                  <a href="#">Click here</a> to unsubscribe if you don't want to receive any emails from us.
                  </p>
                </br>
                </div>
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
