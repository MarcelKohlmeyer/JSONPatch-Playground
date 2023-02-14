((win, doc) => {
    require.config({ paths: {
         vs: 'node_modules/monaco-editor/min/vs',
         jp: 'node_modules/jsonpatch'
        } 
    });

    const startJsonPatch = (inputEditor, outputEditor, JSONPatchEditor) => {
        const patch = () => {

            // Generating objects:
            try {
                const input = JSON.parse(inputEditor.getValue());
                const jsonPatch = JSON.parse(JSONPatchEditor.getValue());
                require(["jp/jsonpatch.min"], function(jsonpatch) {
                    const output = jsonpatch.apply_patch(input, jsonPatch);
                    outputEditor.setValue(JSON.stringify(output));
                    outputEditor.trigger("editor", "editor.action.formatDocument");

                });
                
            } catch {}
        };

        inputEditor.onKeyUp(patch);
        JSONPatchEditor.onKeyUp(patch);
    }

    const initEditors = (inputContainer, outputContainer, JSONPatchContainer) => {
        require(['vs/editor/editor.main'], function () {
            var inputEditor = monaco.editor.create(inputContainer, {
                value: "{\"baz\": \"qux\", \"foo\": \"bar\"}",
                language: 'json'
            });

            var outputEditor = monaco.editor.create(outputContainer, {
                value: "{\n}",
                language: 'json'
            });

            var JSONPatchEditor = monaco.editor.create(JSONPatchContainer, {
                value: "[\n\t{\"op\": \"replace\", \"path\": \"/baz\", \"value\": \"boo\"}\n]",
                language: 'json'
            });

            startJsonPatch(inputEditor, outputEditor, JSONPatchEditor);
        });
    };

    const runScript = (evObj) => {
        const inputContainer = doc.getElementById("input-container");
        const outputContainer = doc.getElementById("output-container");
        const JSONPatchContainer = doc.getElementById("jsonpatch-container");

        initEditors(inputContainer, outputContainer, JSONPatchContainer);
    }

    doc.addEventListener("DOMContentLoaded", runScript);

})(window, document);