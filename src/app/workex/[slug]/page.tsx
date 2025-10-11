 
export default async function SingleWorkExPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
 
  return (
    <div>
        {slug}
    </div>
  )
}