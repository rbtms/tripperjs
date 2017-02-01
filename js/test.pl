use strict;
use warnings;
#use diagnostics;


my @time = ();
my $file = shift;

for(1...1)
    {
        my($time) = system('time node '.$file);
        $time = $1 if $time =~ /real:\s+(.+)s/;
        push(@time, $time);
    }

print @time;
