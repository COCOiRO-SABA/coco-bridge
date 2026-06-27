export async function POST(request) {
  const { password } = await request.json()
  const correctPassword = process.env.ADMIN_PASSWORD
  if (password === correctPassword) {
    return Response.json({ success: true })
  } else {
    return Response.json({ success: false }, { status: 401 })
  }
}
