function Loading({ label = 'Loading' }) {
  return <p className="loading" role="status">{label}<span aria-hidden="true">...</span></p>
}

export default Loading
