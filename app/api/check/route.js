import { Client } from '@notionhq/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const notion = new Client({ auth: process.env.NOTION_TOKEN })
  
  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_SERVICES_DB,
    })
    return Response.json({
      status: 'SUCCESS',
      db_title: response.title?.[0]?.plain_text,
      token_prefix: process.env.NOTION_TOKEN?.substring(0, 15),
    })
  } catch (e) {
    return Response.json({
      status: 'ERROR',
      message: e.message,
      code: e.code,
      token_prefix: process.env.NOTION_TOKEN?.substring(0, 15),
      db_id: process.env.NOTION_SERVICES_DB,
    })
  }
}
