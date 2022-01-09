# sudo nano /etc/profile.d/sshinfo.sh

tcLtG="\033[00;37m" # LIGHT GRAY
tcDkG="\033[01;30m" # DARK GRAY
tcLtR="\033[01;31m" # LIGHT RED
tcLtGRN="\033[01;32m" # LIGHT GREEN
tcLtBL="\033[01;34m" # LIGHT BLUE
tcLtP="\033[01;35m" # LIGHT PURPLE
tcLtC="\033[01;36m" # LIGHT CYAN
tcW="\033[01;37m" # WHITE
tcRESET="\033[0m"
tcORANGE="\033[38;5;209m"
#
# Время суток
HOUR=$(date +"%H")
if [ $HOUR -lt 12 -a $HOUR -ge 4 ]; then TIME="Доброе утро!"
elif [ $HOUR -lt 17 -a $HOUR -ge 12 ]; then TIME="Добрый день!"
elif [ $HOUR -lt 23 -a $HOUR -ge 17 ]; then TIME="Добрый вечер!"
else TIME="Доброй ночи!"
fi
#
# Время с момента перезагрузки
uptime=`cat /proc/uptime | cut -f1 -d.`
upDays=$((uptime/60/60/24))
upHours=$((uptime/60/60%24))
upMins=$((uptime/60%60))
#
# System + Memory
SYS_LOADS=`cat /proc/loadavg | awk '{print $1}'`
MEMORY_USED=`free -m | grep Mem | awk '{print $3}'`
MEMORY_TOTAL=`free -m | grep Mem | awk '{print $2}'`
SWAP_USED=`free -m | grep Swap | awk '{print $3}'`
SWAP_TOTAL=`free -m | grep Swap | awk '{print $2}'`
NUM_PROCS=`ps aux | wc -l`
IPADDRESS=`hostname --all-ip-addresses`
SystemLoad=$(cat /proc/loadavg | cut -d" " -f1);
#
echo -e $tcLtG " $TIME $tcORANGE $USER"
echo -e $tcLtG " - Хост :$tcW `hostname -f`"
echo -e $tcLtG " - IP Адрес :$tcW $IPADDRESS"
echo -e $tcLtG " - Версия :$tcW $(lsb_release -s -d)"
echo -e $tcLtG " - Ядро : `uname -a | awk '{print $1" "$3" "$12}'`"
echo -e $tcLtG " - Пользователи : Авторизованных пользователей - `users | wc -w`"
echo -e $tcLtG " - Время на сервере : `date +"%A, %d %B %Y г., %T"`"
echo -e $tcLtP " - Загрузка системы : $SYS_LOADS % CPU/ $NUM_PROCS запущенных процессов"
echo -e $tcLtBL " - Память, RAM : Исп.: $MEMORY_USED Мб / Всего: $MEMORY_TOTAL Мб"
df -h
echo -e $tcRESET ""
#

