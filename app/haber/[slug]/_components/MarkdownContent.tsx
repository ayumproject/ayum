export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div
      className="news-content prose prose-lg max-w-none"
      style={{ fontSize: '17px', lineHeight: '1.9', color: '#2B2C35' }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
