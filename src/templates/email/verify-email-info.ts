export function verifyEmailInfoTemplate(email: string, nick: string, id: string) {
  return `
<h1>Hello ${nick} in ShopApp</h1>
<p>This app is still in development mode.</p>
<h2>E-mail verification</h2>
<p><strong>${nick}</strong>, please confirm your e-mail address <strong>${email}</strong> by clicking the link below</p>
<a href="http://localhost:3002/user/verify-email/${id}">http://localhost:3002/user/verify-email/${id}</a>
`;
}
