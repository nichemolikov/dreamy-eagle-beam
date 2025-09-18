import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, CheckCircle, DollarSign } from "lucide-react";

const DashboardOverview = () => {
  // Placeholder data - in a real app, this would come from Supabase
  const stats = [
    { title: "Общо клиенти", value: "1,234", icon: Users, description: "Нови клиенти този месец: +50" },
    { title: "Активни ремонти", value: "78", icon: Car, description: "В процес на изпълнение: 25" },
    { title: "Завършени ремонти", value: "456", icon: CheckCircle, description: "Завършени този месец: +30" },
    { title: "Генерирани приходи", value: "лв. 12,345", icon: DollarSign, description: "Приходи този месец: +лв. 2,500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Преглед на таблото</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последни дейности</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Тук ще се показват последни ремонти, нови клиенти и други важни събития.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;