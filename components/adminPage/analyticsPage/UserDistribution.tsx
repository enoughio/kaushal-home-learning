import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDataService } from "@/lib/adminData";

const UserDistributionClient = async function () {
  const [stats] = await Promise.all([AdminDataService.getPlatformStats()]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Students / Teachers Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Students</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-1 rounded-full"
                  style={{
                    width: `${(stats.totalStudents / stats.totalUsers) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium">{stats.totalStudents}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Teachers</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2 rounded-full"
                  style={{
                    width: `${(stats.totalTeachers / stats.totalUsers) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium">{stats.totalTeachers}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Status */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Approved</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2 rounded-full"
                  style={{
                    width: `${
                      (stats.approvedTeachers / stats.totalTeachers) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium">
                {stats.approvedTeachers}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Pending</span>
            <div className="flex items-center gap-2">
              <div
                className="w-20 h-2 bg-yellow-500 rounded-full"
                style={{
                  width: `${
                    (stats.pendingTeachers / stats.totalTeachers) * 100
                  }%`,
                }}
              />
              <span className="text-sm font-medium">
                {stats.pendingTeachers}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-1">
              {stats.approvedTeachers
                ? Math.round(
                    (stats.totalStudents / stats.approvedTeachers) * 10
                  ) / 10
                : 0}
            </p>
            <p className="text-sm text-muted-foreground">
              Students per Teacher
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-3">
              ₹
              {stats.totalRevenue && stats.totalStudents
                ? Math.round(stats.totalRevenue / stats.totalStudents)
                : 0}
            </p>
            <p className="text-sm text-muted-foreground">Revenue per Student</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDistributionClient;
