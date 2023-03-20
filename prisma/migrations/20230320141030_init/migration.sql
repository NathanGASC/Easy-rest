-- CreateTable
CREATE TABLE "ER_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT,
    "api_key" TEXT
);

-- CreateTable
CREATE TABLE "ER_Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ER_Route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ER_PropertyAccess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routeId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "property" TEXT,
    CONSTRAINT "ER_PropertyAccess_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ER_Route" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ER_PropertyAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ER_Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ask" TEXT,
    "responseId" INTEGER,
    CONSTRAINT "Ask_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Response" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "response" TEXT
);

-- CreateTable
CREATE TABLE "_ER_RoleToER_User" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ER_RoleToER_User_A_fkey" FOREIGN KEY ("A") REFERENCES "ER_Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ER_RoleToER_User_B_fkey" FOREIGN KEY ("B") REFERENCES "ER_User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ER_RoleToER_User_AB_unique" ON "_ER_RoleToER_User"("A", "B");

-- CreateIndex
CREATE INDEX "_ER_RoleToER_User_B_index" ON "_ER_RoleToER_User"("B");
