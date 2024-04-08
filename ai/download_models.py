from transformers import GPT2Tokenizer, GPT2Model
import os


def download_model(model_path, model_name):
    """Download a Hugging Face model and tokenizer to the specified directory"""
    # Check if the directory already exists
    if not os.path.exists(model_path):
        # Create the directory
        os.makedirs(model_path)

    tokenizer = GPT2Tokenizer.from_pretrained(model_name)
    model = GPT2Model.from_pretrained(model_name, device_map="auto")

    # Save the model and tokenizer to the specified directory
    model.save_pretrained(model_path)
    tokenizer.save_pretrained(model_path)


# For this demo, download the English-French and French-English models
download_model("models/text-generation/", "gpt2-large")
