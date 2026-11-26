import MessageForm from './MessageForm';
import styles from './Form.module.css';

/**
 * Inquire about one art piece. The piece's name travels with the message.
 *
 * @param {{ piece: import('@/content').ArtWork }} props
 */
export default function InquiryForm({ piece }) {
  return (
    <MessageForm
      submitLabel="Send inquiry"
      intro={
        <>
          <h2 className={styles.formTitle}>Inquire</h2>
          <p className={styles.formNote}>About: {piece.title}</p>
        </>
      }
      buildPayload={(values) => ({
        _subject: `Inquiry: ${piece.title}`,
        form: 'inquiry',
        piece: piece.title,
        pieceUrl: window.location.href,
        name: values.name,
        email: values.email,
        message: values.message,
      })}
    />
  );
}
