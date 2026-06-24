export async function GET() {
  return Response.json({
    token_prefix: process.env.NOTION_TOKEN?.substring(0, 10) ?? 'NOT SET',
    services_db: process.env.NOTION_SERVICES_DB ?? 'NOT SET',
  })
}
