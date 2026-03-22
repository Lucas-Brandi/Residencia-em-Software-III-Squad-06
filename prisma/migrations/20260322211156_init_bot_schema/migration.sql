-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "resetToken" TEXT
);

-- CreateTable
CREATE TABLE "repositories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "teamId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "analysis_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repositoryId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    CONSTRAINT "analysis_rules_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "analysis_rules_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pull_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repositoryId" TEXT NOT NULL,
    "prNumber" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "pull_requests_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pull_requests_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analysis_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prId" TEXT NOT NULL,
    "healthScore" REAL NOT NULL,
    "iaFeedback" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analysis_results_prId_fkey" FOREIGN KEY ("prId") REFERENCES "pull_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_githubId_key" ON "repositories"("githubId");
