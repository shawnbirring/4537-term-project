import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from transformers import GPT2Tokenizer, GPT2LMHeadModel, pipeline, set_seed


def get_model(model_path):
    """Load a Hugging Face model and tokenizer from the specified directory"""
    tokenizer = GPT2Tokenizer.from_pretrained(model_path)
    model = GPT2LMHeadModel.from_pretrained(model_path, device_map="auto")
    return model, tokenizer


# load the model
model, tokenizer = get_model("models/text-generation")

app = Flask(__name__)
CORS(app, origins="*", methods="*")


def get_content_after(s1, s2):
    index = s1.find(s2)
    if index == -1:
        return None  # If s2 is not found in s1
    return s1[index + len(s2) :].strip()


@app.route("/generate_text", methods=["POST"])
def generate_text():
    token = request.headers.get("Authorization").split()[1]
    if token != os.getenv("BEARER_TOKEN"):
        return Response("Not Authorized", status=401, mimetype="application/json")

    text = (
        request.json["prompt"]
        + " As a jury in the following situation I would say that"
    )

    generator = pipeline("text-generation", model=model, tokenizer=tokenizer)
    set_seed(42)
    outputs = generator(text, max_length=120, truncation=True, num_return_sequences=1)

    return jsonify(get_content_after(outputs[0]["generated_text"], text).strip())
    # return jsonify(get_content_after(outputs[0]["generated_text"], text))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
