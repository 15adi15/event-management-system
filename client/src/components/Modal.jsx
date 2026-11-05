function Modal({ children, onClose, title }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <button className="modal__close" type="button" onClick={onClose} aria-label="Close">×</button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  )
}

export default Modal
