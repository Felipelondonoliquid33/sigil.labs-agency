/* Scene factories by name, each imported only on the client so three.js stays
   out of the route bundles. */
export const SCENES = {
  archive: () => import("./archiveScene").then((m) => m.createArchiveScene),
  bridge: () => import("./bridgeScene").then((m) => m.createBridgeScene),
  pipeline: () => import("./pipelineScene").then((m) => m.createPipelineScene),
  radar: () => import("./radarScene").then((m) => m.createRadarScene),
};
