import React, { useRef, useState } from 'react';

import { View } from 'react-native';
import RTMPPublisher, {
  RTMPPublisherRefProps,
  StreamState,
} from 'react-native-rtmp-publisher';
import Config from 'react-native-config';

import styles from './App.styles';

import Button from './components/Button';
import LiveBadge from './components/LiveBadge';
import usePermissions from './hooks/usePermissions';

const STREAM_URL = Config.STREAM_URL;
const STREAM_NAME = Config.STREAM_NAME;

export default function App() {
  const publisherRef = useRef<RTMPPublisherRefProps>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const { permissionGranted } = usePermissions();

  function handleOnConnectionFailed(data: String) {
    console.log('Connection Failed: ' + data);
  }

  function handleOnConnectionStarted(data: String) {
    console.log('Connection Started: ' + data);
  }

  function handleOnConnectionSuccess() {
    console.log('Connected');
    setIsStreaming(true);
  }

  function handleOnDisconnect() {
    console.log('Disconnected');
    setIsStreaming(false);
  }

  function handleOnNewBitrateReceived(data: number) {
    console.log('New Bitrate Received: ' + data);
  }

  function handleOnStreamStateChanged(data: StreamState) {
    console.log('Stream Status: ' + data);
  }

  function handleUnmute() {
    publisherRef.current && publisherRef.current.unmute();
    setIsMuted(false);
  }

  function handleMute() {
    publisherRef.current && publisherRef.current.mute();
    setIsMuted(true);
  }

  function handleStartStream() {
    publisherRef.current && publisherRef.current.startStream();
  }

  function handleStopStream() {
    publisherRef.current && publisherRef.current.stopStream();
  }

  function handleSwitchCamera() {
    publisherRef.current && publisherRef.current.switchCamera();
  }

  return (
    <View style={styles.container}>
      {permissionGranted && (
        <RTMPPublisher
          ref={publisherRef}
          streamURL={STREAM_URL}
          streamName={STREAM_NAME}
          style={styles.publisher_camera}
          onDisconnect={handleOnDisconnect}
          onConnectionFailed={handleOnConnectionFailed}
          onConnectionStarted={handleOnConnectionStarted}
          onConnectionSuccess={handleOnConnectionSuccess}
          onNewBitrateReceived={handleOnNewBitrateReceived}
          onStreamStateChanged={handleOnStreamStateChanged}
        />
      )}
      <View style={styles.footer_container}>
        {isMuted ? (
          <Button title="Unmute" onPress={handleUnmute} />
        ) : (
          <Button title="Mute" onPress={handleMute} />
        )}
        {isStreaming ? (
          <Button title="Stop Stream" onPress={handleStopStream} />
        ) : (
          <Button title="Start Stream" onPress={handleStartStream} />
        )}
        <Button title="Switch Camera" onPress={handleSwitchCamera} />
      </View>
      {isStreaming && <LiveBadge />}
    </View>
  );
}
