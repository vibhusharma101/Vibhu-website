 
export default async function SingleProjectPage({
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