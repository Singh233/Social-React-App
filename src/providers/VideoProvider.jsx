import { createContext } from 'react';
import { useProvideVideo } from '../hooks/useVideo';

const initialState = {};

export const VideoContext = createContext(initialState);

export const VideoProvider = ({ children }) => {
  const video = useProvideVideo();

  return (
    <VideoContext.Provider value={video}> {children} </VideoContext.Provider>
  );
};
