import Modal from "./modal";

interface Props {
  text: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
function ConfirmModal({ text, isOpen, onConfirm, onCancel }: Props) {
  const onConfirmWithClose = () => {
    onCancel();
    onConfirm();
  }
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel} className="sm:w-[32rem]">
      <p className="mb-7 text-xl font-medium">{text}</p>
      <div className="flex justify-end">
        <button
          type="button"
          className="py-5 px-7 hover:border hover:scale-110 rounded-xl mr-4"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-7 py-5 bg-[#EB5757] hover:scale-110 text-white rounded-xl"
          onClick={onConfirmWithClose}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;