import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, CheckCircle, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils"; // Assuming you have a utility for currency formatting

// Helper to get start and end of current month
const getMonthBounds = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startOfMonth: startOfMonth.toISOString(), endOfMonth: endOfMonth.toISOString() };
};

const DashboardOverview = () => {
  const { startOfMonth, endOfMonth } = getMonthBounds();

  // Fetch total clients
  const { data: totalClients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["totalClients"],
    queryFn: async () => {
      const { count, error } = await supabase.from("clients").select("id", { count: "exact", head: true });
      if (error) throw error;
      return count;
    },
  });

  // Fetch new clients this month
  const { data: newClientsThisMonth, isLoading: isLoadingNewClients } = useQuery({
    queryKey: ["newClientsThisMonth"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("clients")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfMonth)
        .lt("created_at", endOfMonth);
      if (error) throw error;
      return count;
    },
  });

  // Fetch active repairs (Pending or In Progress)
  const { data: activeRepairs, isLoading: isLoadingActiveRepairs } = useQuery({
    queryKey: ["activeRepairs"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("repairs")
        .select("id", { count: "exact", head: true })
        .in("status", ["Pending", "In Progress"]);
      if (error) throw error;
      return count;
    },
  });

  // Fetch completed repairs
  const { data: completedRepairs, isLoading: isLoadingCompletedRepairs } = useQuery({
    queryKey: ["completedRepairs"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("repairs")
        .select("id", { count: "exact", head: true })
        .eq("status", "Completed");
      if (error) throw error;
      return count;
    },
  });

  // Fetch completed repairs this month
  const { data: completedRepairsThisMonth, isLoading: isLoadingCompletedRepairsMonth } = useQuery({
    queryKey: ["completedRepairsThisMonth"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("repairs")
        .select("id", { count: "exact", head: true })
        .eq("status", "Completed")
        .gte("created_at", startOfMonth)
        .lt("created_at", endOfMonth);
      if (error) throw error;
      return count;
    },
  });

  // Fetch total revenue
  const { data: totalRevenue, isLoading: isLoadingTotalRevenue } = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("cost")
        .eq("status", "Completed");
      if (error) throw error;
      return data.reduce((sum, repair) => sum + (repair.cost || 0), 0);
    },
  });

  // Fetch revenue this month
  const { data: revenueThisMonth, isLoading: isLoadingRevenueMonth } = useQuery({
    queryKey: ["revenueThisMonth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("cost")
        .eq("status", "Completed")
        .gte("created_at", startOfMonth)
        .lt("created_at", endOfMonth);
      if (error) throw error;
      return data.reduce((sum, repair) => sum + (repair.cost || 0), 0);
    },
  });

  const stats = [
    {
      title: "Общо клиенти",
      value: isLoadingClients ? "..." : (totalClients || 0).toString(),
      icon: Users,
      description: isLoadingNewClients ? "..." : `Нови клиенти този месец: +${newClientsThisMonth || 0}`,
    },
    {
      title: "Активни ремонти",
      value: isLoadingActiveRepairs ? "..." : (activeRepairs || 0).toString(),
      icon: Car,
      description: "В процес на изпълнение: " + (isLoadingActiveRepairs ? "..." : (activeRepairs || 0).toString()), // Assuming active repairs are all "in progress" for simplicity
    },
    {
      title: "Завършени ремонти",
      value: isLoadingCompletedRepairs ? "..." : (completedRepairs || 0).toString(),
      icon: CheckCircle,
      description: isLoadingCompletedRepairsMonth ? "..." : `Завършени този месец: +${completedRepairsThisMonth || 0}`,
    },
    {
      title: "Генерирани приходи",
      value: isLoadingTotalRevenue ? "..." : formatCurrency(totalRevenue || 0),
      icon: DollarSign,
      description: isLoadingRevenueMonth ? "..." : `Приходи този месец: +${formatCurrency(revenueThisMonth || 0)}`,
    },
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