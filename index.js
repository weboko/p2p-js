import { createLightNode, createDecoder, createEncoder, utf8ToBytes, bytesToUtf8 } from "@waku/sdk";

(async () => {
  const node = await createLightNode({ defaultBootstrap: true });
  const decoder = createDecoder("/devcon/1/ping-pong/proto");
  const encoder = createEncoder({ contentTopic: "/devcon/1/ping-pong/proto" });

  await node.waitForPeers();

  const result = await node.filter.subscribe(decoder, (message) => {
    console.log("DEBUG: got message", bytesToUtf8(message.payload));
  });

  console.log("DEBUG: subscribed to ", result);

  for (let i = 0; i < 10; i++) {
    console.log("DEBUG: waiting");
    await (new Promise(resolve => setTimeout(resolve, 5000)));
    console.log("DEBUG: sending message");
    await node.lightPush.send(encoder, {
      payload: utf8ToBytes("hey " + i)
    });
  }
})();