import { StudentsForm, StudentsList } from "@/modules/students";

export default function StudentsPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">學生管理</h1>
      <StudentsForm />
      <StudentsList />
    </div>
  );
}
