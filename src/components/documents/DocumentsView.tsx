import { useState, useEffect } from "react";
import { toast } from "sonner";
import DocumentUpload from "./DocumentUpload";
import DocumentList from "./DocumentList";
import { Document } from "./DocumentCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DocumentsView = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents from backend
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/documents/list`);
      const data = await response.json();
      
      if (data.success && data.documents) {
        // Transform backend data to frontend format
        const transformedDocs: Document[] = data.documents.map((doc: any) => ({
          id: doc.id.toString(),
          name: doc.metadata?.filename || doc.metadata?.title || `Document ${doc.id}`,
          type: doc.metadata?.file_type || "unknown",
          size: 0, // Size not stored in backend
          uploadedAt: new Date(doc.created_at || doc.metadata?.upload_date),
          status: "embedded" as const,
        }));
        
        setDocuments(transformedDocs);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);

      try {
        const response = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          toast.success(`${file.name} uploaded successfully`);
          return true;
        } else {
          toast.error(`Failed to upload ${file.name}: ${result.error || result.message}`);
          return false;
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
        return false;
      }
    });

    await Promise.all(uploadPromises);
    
    // Refresh document list
    fetchDocuments();
  };

  const handleViewDocument = (doc: Document) => {
    toast.info(`Viewing: ${doc.name}`);
  };

  const handleDeleteDocument = async (doc: Document) => {
    try {
      const response = await fetch(`${API_URL}/api/documents/${doc.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
        toast.success(`Deleted: ${doc.name}`);
      } else {
        toast.error(`Failed to delete: ${doc.name}`);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(`Failed to delete: ${doc.name}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Document Management</h1>
        <p className="text-muted-foreground">
          Upload and manage your documents for RAG-powered search
        </p>
      </div>

      <DocumentUpload onUpload={handleUpload} />
      
      <DocumentList
        documents={documents}
        onViewDocument={handleViewDocument}
        onDeleteDocument={handleDeleteDocument}
      />
    </div>
  );
};

export default DocumentsView;
