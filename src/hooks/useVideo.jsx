import { lazy, useContext, useEffect, useState } from 'react';

import { VideoContext } from '../providers';

export const useVideo = () => {
  return useContext(VideoContext);
};

export const useProvideVideo = () => {
  // loading state for cam mic access
  const [camLoading, setCamLoading] = useState(false);
  // state for video icon click
  const [videoIconClicked, setVideoIconClicked] = useState(false);
  // state for call minimised or maximised
  const [isCallMinimised, setIsCallMinimised] = useState(false);
  // state for call receiver data
  const [callReceiver, setCallReceiver] = useState(null);
  // state for incoming call
  const [incomingCall, setIncomingCall] = useState(false);
  // state for x position of call wrapper
  const [boundX, setBoundX] = useState(0);

  // handle initiate video call
  const initiateVideoCall = () => {
    setVideoIconClicked(true);
    setIncomingCall(false);
  };

  // handle exit video call
  const exitVideoCall = () => {
    setVideoIconClicked(false);
    setIncomingCall(false);
  };

  return {
    boundX,
    setBoundX,
    camLoading,
    setCamLoading,
    incomingCall,
    setIncomingCall,
    videoIconClicked,
    setVideoIconClicked,
    isCallMinimised,
    setIsCallMinimised,
    callReceiver,
    setCallReceiver,
    exitVideoCall,
    initiateVideoCall,
  };
};
