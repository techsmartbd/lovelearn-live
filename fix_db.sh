#!/bin/bash
cd /var/www/lovelearn.live

# Replace "details   String" with "details   String   @db.Text" in ActivityLog
sed -i '/model ActivityLog {/,/}/ s/details\s*String.*/details   String   @db.Text/' prisma/schema.prisma

# We also need to fix other potentially long JSON strings.
# For example, let's check other models. User.name etc are fine.
# Ebook description, Package description, Video description might also be long!
sed -i '/model Package {/,/}/ s/description\s*String?.*/description   String?  @db.Text/' prisma/schema.prisma
sed -i '/model Video {/,/}/ s/description\s*String?.*/description   String?  @db.Text/' prisma/schema.prisma
sed -i '/model Ebook {/,/}/ s/description\s*String?.*/description   String?  @db.Text/' prisma/schema.prisma

npx prisma generate
npx prisma db push --accept-data-loss
pm2 restart lovelearn
