from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)
CORS(app, origins="*", methods="*")

# Load the pre-trained model and tokenizer
model_name = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Set the model to evaluation mode
device = "cpu"
model.to(device)
model.eval()


@app.route("/generate_text", methods=["POST"])
def generate_text():
    # Get the prompt from the request
    prompt = (
        "Your are a jury, say whatever a jury would say in the following situation: "
        + request.json["prompt"]
    )

    # Prepare messages in the required format
    messages = [{"role": "user", "content": prompt}]

    # Tokenize the messages
    encodeds = tokenizer.apply_chat_template(messages, return_tensors="pt")

    # Move inputs to the appropriate device
    model_inputs = encodeds.to(device)

    # Generate text based on the input prompt
    generated_ids = model.generate(model_inputs, max_new_tokens=1000, do_sample=True)
    decoded = tokenizer.batch_decode(generated_ids)

    return jsonify({"generated_text": decoded[0]})


if __name__ == "__main__":
    port = 5001  # Default port
    app.run(debug=True, port=port)
