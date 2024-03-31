class TextGenerationPipeline {
  static task = "text-generation";
  static model = "Xenova/Qwen1.5-0.5B-Chat";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // Dynamically import the Transformers.js library
      let { pipeline, env } = await import("@xenova/transformers");

      // NOTE: Uncomment this to change the cache directory
      env.cacheDir = "./.cache";

      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

module.exports.TextGenerationPipeline = TextGenerationPipeline;
