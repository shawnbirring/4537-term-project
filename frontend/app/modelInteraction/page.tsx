import Button from "./components/Button";
import TextArea from "./components/TextArea";
import Title from "./components/Title";

export default function ModelInteraction() {
    return(<>
    <Title text= "Interact with the Model"/>
    <TextArea placeholder="Ask a question ..."/>
    <Button label="Interact"/>
    </>)
}