import Field from './Field';
import MessageForm from './MessageForm';

const CONTACT_TOPICS = ['Bookings', 'Partnership', 'Press'];

/**
 * General contact form: name, email, topic, message.
 *
 * @param {{ className?: string }} props
 */
export default function ContactForm({ className }) {
  return (
    <MessageForm
      className={className}
      submitLabel="Send"
      messageRows={5}
      renderExtraFields={(values) => (
        <Field
          label="I'm writing about"
          name="topic"
          as="select"
          options={CONTACT_TOPICS}
          defaultValue={values.topic ?? CONTACT_TOPICS[0]}
        />
      )}
      buildPayload={(values) => ({
        _subject: `Website message: ${values.topic}`,
        form: 'contact',
        topic: values.topic,
        name: values.name,
        email: values.email,
        message: values.message,
      })}
    />
  );
}
