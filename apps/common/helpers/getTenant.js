import Tenant from '../entities/Tenant/api';

export default (host) => {
  // const currentHost = host.replace(/\./g, '_'); dont need anymore cause host in Tenant is with dot now instead of _
  const tenant = Tenant.findOne({ host });
  if (!tenant) throw new Error('Tenant not found');
  if (!tenant.owner) throw new Error('Tenant owner not found');
  if (!tenant.settings) throw new Error('Tenant settings not found');

  return tenant;
};
