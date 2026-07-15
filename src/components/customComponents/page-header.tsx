import OpenDialogs from "./OpenDialogs";

type PageHeaderProps = {
  permission: string;
  pageTitle: string;
  buttonText?: string;
  modalKey?: string;
  showAddButton?: boolean;
};
export const PageHeader = ({
  permission,
  pageTitle,
  buttonText = "Add",
  modalKey = "",
  showAddButton = false,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-0">
      <h1 className="font-bold text-xl bg-linear-to-r from-primary to-muted-foreground dark:to-accent bg-clip-text text-transparent line-clamp-1">
        {pageTitle}
      </h1>
      <div>
        {showAddButton && (
          <OpenDialogs
            dialogKey={modalKey}
            title={buttonText}
            permission={permission}
          />
        )}
      </div>
    </div>
  );
};
