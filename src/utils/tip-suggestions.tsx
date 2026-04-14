import { PlaceholderList } from "@/components/customComponents/placeholder-list";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

export const suggestionConfig = {
  //   char: "{{",
  items: ({ query }: { query: string }) => {
    return [
      "student_name",
      "enrollment_code",
      "school_id",
      "programme",
      "admission_date",
      "residential_status",
      "affiliated_house",
      "room_code",
    ]
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  },

  command: ({ editor, range, props }: any) => {
    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: "text",
          text: `{{${props.id}}} `, // This inserts literal text instead of a Mention node
        },
      ])
      .run();
  },

  render: () => {
    let component: any;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(PlaceholderList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
