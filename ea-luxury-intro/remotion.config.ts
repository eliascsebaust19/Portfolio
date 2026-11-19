import { Config } from "@remotion/cli/config";

// The smoke is a WebGL shader: ANGLE gives consistent results in Studio and in renders.
Config.setChromiumOpenGlRenderer("angle");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setCrf(14);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
