import 'react'

// Redecalare forwardRef to restore type inference on the forwarded component
// see: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/#generic-forwardrefs
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}
