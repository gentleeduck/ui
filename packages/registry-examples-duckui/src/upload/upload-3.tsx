import { UploadProfile, UploadProvider } from '@/registry/registry-ui-components/upload'

export default function Upload3Demo() {
  return (
    <>
      <UploadProvider>
        <UploadProfile />
      </UploadProvider>
    </>
  )
}
