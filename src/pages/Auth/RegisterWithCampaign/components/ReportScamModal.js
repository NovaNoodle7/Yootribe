import { storeReport } from '../../../../api/requests/Reports';

export const ReportScamModalContent = ({ campaign_id, closeModal }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    storeReport({ message: e.target.message.value, campaign_id })
      .then(() => {
        closeModal();
      })
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit} className="form" style={{ width: '100%', padding: '50px 80px' }}>
      <div className="form-group">
        <label htmlFor="message" style={{ color: '#fff' }}>
          Message
        </label>
        <textarea id="message" name="message" type="message" required style={{ width: '100%' }} />
      </div>

      <button className={'action-button outlined white'} type="submit" style={{ width: '100%' }}>
        Submit
      </button>
    </form>
  );
};
