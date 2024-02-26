import React, { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import '../styles/css/EditProfileDialog.scss';
import { useAuth } from '@/hooks/useAuth';
import { FilePond } from 'react-filepond';
import '../styles/css/home/filepond.css';
import { Avatar } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSaveChangesClick = () => {
    // save changes
  };

  return (
    <Dialog.Root open={true}>
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
            files={''}
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
            <input className="Input" id="name" defaultValue={auth.user.name} />
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
            <Dialog.Close asChild>
              <button
                onClick={() => navigate('/settings')}
                className="Button green"
              >
                Go back
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button onClick={handleSaveChangesClick} className="Button green">
                Save changes
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditProfile;
