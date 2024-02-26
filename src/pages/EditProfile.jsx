import React, { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import '../styles/css/EditProfileDialog.scss';
import { useAuth } from '@/hooks/useAuth';
import { FilePond } from 'react-filepond';
import '../styles/css/home/filepond.css';
import { Avatar } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EditProfile = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const nameInputRef = useRef(null);
  const [file, setFile] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveChangesClick = async () => {
    // validate the fields
    if (nameInputRef.current?.value < 1) {
      toast.error('Name cannot be empty');
      return;
    }
    setIsUpdating(true);

    const toastId = toast.loading('Updating user...');

    const response = await auth.updateUser(nameInputRef.current.value, file);

    if (response.success) {
      toast.success(response.message, {
        id: toastId,
      });
    } else {
      toast.error(response.message, {
        id: toastId,
      });
    }

    setIsUpdating(false);

    // clear the file input
    setFile([]);
  };

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        {/* <Dialog.Overlay className="DialogOverlay" /> */}
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Edit profile</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>

          <div className="Avatar">
            <Avatar
              src={auth.user.avatar ? auth.user.avatar : ''}
              alt={auth.user.name}
              size="lg"
              variant="plain"
            />
          </div>

          <FilePond
            files={file}
            onupdatefiles={(fileItems) => {
              // Set currently active file objects to this.state
              setFile(fileItems.map((fileItem) => fileItem.file));
            }}
            allowMultiple={false}
            maxFiles={1}
            allowFileTypeValidation={true}
            acceptedFileTypes={['image/*']}
            allowFileSizeValidation={true}
            maxFileSize={'100MB'}
            name="filepond" /* sets the file input name, it's filepond by default */
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="name">
              Name
            </label>
            <input
              ref={nameInputRef}
              className="Input"
              id="name"
              defaultValue={auth.user.name}
            />
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="username">
              Email
            </label>
            <input
              disabled
              className="emailInput"
              id="username"
              defaultValue={auth.user.email}
            />
          </fieldset>
          <div
            style={{
              display: 'flex',
              marginTop: 35,
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={() => navigate('/settings')}
              className="Button green"
            >
              Go back
            </button>

            <button
              onClick={handleSaveChangesClick}
              disabled={isUpdating}
              className="Button green"
            >
              {isUpdating ? 'Updating...' : 'Save changes'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditProfile;
