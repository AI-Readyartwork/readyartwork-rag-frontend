import { Construction } from "lucide-react";

const MeetingsView = () => {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Construction className="h-16 w-16 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
        <p className="text-muted-foreground text-lg mb-2">
          Meeting Transcripts feature is under development
        </p>
        <p className="text-muted-foreground">
          We're working hard to bring you the ability to manage and search through meeting recordings and transcripts.
        </p>
      </div>
    </div>
  );
};

export default MeetingsView;
